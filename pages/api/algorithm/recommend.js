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
        console.log("p", processedproduct[term]);
        console.log("O", processedorders[term]);
        console.log(term);
        console.log(dotProduct);
        console.log(magnitudeproduct);
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

      console.log(cosineSimilarity);

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

    console.log(newArray);

    const resultArray = newArray.map((item) => {
      const match = product.filter(
        (element) => element.category === item.title
      );
      return match;
    });

    res.status(200).json({
      success: true,
      data: resultArray,
    });
  }
};

export default connectToDb(handler);
