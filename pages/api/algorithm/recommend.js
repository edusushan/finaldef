import connectToDb from "../../../middleware/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Variants from "../../../models/Variants";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;
    function calculateCosineSimilarity(product, orders) {
      if (product.length === 0 || orders.length === 0) {
        return 0;
      }
      const processData = (arr) => {
        const processedData = {};
        for (const obj of arr) {
          const title = obj.title.toLowerCase();
          processedData[title] = 1;
        }
        return processedData;
      };
      const processedproduct = processData(product);
      const processedorders = processData(orders);

      let dotProduct = 0;
      let magnitudeproduct = 0;
      let magnitudeorders = 0;

      for (const term in processedproduct) {
        dotProduct += processedproduct[term] * (processedorders[term] || 0);
        magnitudeproduct += processedproduct[term] * processedproduct[term];
      }

      for (const term in processedorders) {
        magnitudeorders += processedorders[term] * processedorders[term];
      }

      magnitudeproduct = Math.sqrt(magnitudeproduct);
      magnitudeorders = Math.sqrt(magnitudeorders);

      if (magnitudeproduct === 0 || magnitudeorders === 0) {
        return 0;
      }

      const cosineSimilarity =
        dotProduct / (magnitudeproduct * magnitudeorders);
      return cosineSimilarity;
    }
    function findSimilarItems(product, orders, threshold) {
      const similarItems = [];
      for (const item1 of product) {
        for (const item2 of orders) {
          const similarity = calculateCosineSimilarity([item1], [item2]);
          if (similarity > threshold) {
            similarItems.push(item1);
            break;
          }
        }
      }
      return similarItems;
    }
    function euclideanDistance(value1, value2) {
      return Math.sqrt((value1 - value2) ** 2);
    }

    let product = await Product.find().populate({
      path: "variants",
      model: Variants,
      options: { lean: true },
    });
    const newProduct = product.map((item) => ({ title: item.category }));
    const order = await Order.find({ email });
    const response = order.map((order) => {
      const productNames = Object.values(order.products).map(
        (product) => product.title
      );
      return { title: productNames.join(", ") };
    });
    const threshold = 0.6;
    const similarItems = findSimilarItems(newProduct, response, threshold);
    const newArray = [];
    const encounteredTitles = new Set();

    similarItems.forEach((item) => {
      if (!encounteredTitles.has(item.title)) {
        newArray.push({ title: item.title });
        encounteredTitles.add(item.title);
      }
    });
    const resultArray = newArray.map((item) => {
      const match = product.filter(
        (element) => element.category === item.title
      );
      return match;
    });
    const flatArray = resultArray.flat();

    const filteredArray = flatArray.map((item) => ({
      title: item.title,
      price: item.price,
    }));

    const filteredProducts = product.map((item) => ({
      title: item.title,
      price: item.price,
    }));
    let closestDistance = 50;
    let closestItems = [];

    filteredArray.map((item1) => {
      filteredProducts.map((item2) => {
        const distance = euclideanDistance(item1.price, item2.price);
        console.log("D", distance);
        if (distance < closestDistance) {
          closestItems.push({ title1: item1.title, title2: item2.title });
        }
      });
    });
    const resultFinalArray = closestItems.map((item) => {
      const match = flatArray.filter(
        (element) => element.title === item.title2
      );
      return match;
    });
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function getRandomItems(array, count = 20) {
      if (array.length < count) {
        throw new Error("Array length is smaller than the requested count.");
      }

      const shuffledArray = shuffleArray([...array]);

      return shuffledArray.slice(0, count);
    }

    try {
      const randomItems = getRandomItems(resultFinalArray, 12);

      res.status(200).json({
        success: true,
        data: randomItems,
      });
    } catch (e) {
      res.status(200).json({
        success: true,
        message: "Error occured while calculating eucledian distance!!",
      });
    }
  }
};

export default connectToDb(handler);
