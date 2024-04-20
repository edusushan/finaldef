"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

const RecommendCard = ({ details, addToCart }) => {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledDetails = shuffleArray(details.flat());

  return (
    <>
      {shuffledDetails &&
        shuffledDetails.slice(0, 3).map((d, i) => (
          <div
            key={i}
            className="group box-border overflow-hidden flex rounded-md shadow-sm pe-0 flex-col items-center bg-white relative"
          >
            <div
              onClick={() => {}}
              className="relative flex justify-center w-full cursor-pointer"
            >
              {true ? (
                ""
              ) : (
                <span className="absolute text-dark text-xs bg-orange-500 text-white py-1 px-2 rounded font-medium z-10 right-4 top-4">
                  {Math.ceil(30)}% Off
                </span>
              )}
              {d.availableQty > 2 ? (
                ""
              ) : (
                <span className="absolute inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-600 border-0 rounded-full text-xs font-semibold z-10 left-4 top-4">
                  {d.availableQty < 1 ? "out of Stock" : "Limited Stock"}
                </span>
              )}

              <Link
                disabled={d.availableQty === 0 ? true : false}
                href={`/products/${d.slug}`}
                style={{
                  boxSizing: "borderBox",
                  display: "inline-block",
                  overflow: "hidden",
                  width: "initial",
                  height: "initial",
                  background: "none",
                  opacity: "1",
                  border: "0px",
                  margin: "0px",
                  padding: "0px",
                  position: "relative",
                  maxWidth: "100%",
                }}
              >
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "block",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: "1",
                    border: "0",
                    margin: "0",
                    padding: "0",
                    maxWidth: "100%",
                  }}
                >
                  <img
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: "1",
                      border: "0",
                      margin: "0",
                      padding: "0",
                    }}
                  />
                </span>
                <img
                  src={d?.mainImage}
                  decoding="async"
                  data-nimg="intrinsic"
                  className="object-cover transition duration-150 ease-linear transform group-hover:scale-105"
                  style={{
                    inset: "0px",
                    boxSizing: " border-box",
                    padding: "0px",
                    border: "none",
                    margin: "auto",
                    display: " block",
                    width: "160px",
                    height: "160px",
                    minWidth: "100%",
                    maxWidth: "100%",
                    minHeight: "100%",
                    maxHeight: " 100%",
                  }}
                />
              </Link>
            </div>
            <div className="w-full px-3 lg:px-4 pb-4 overflow-hidden">
              <div className="relative mb-1">
                <span className="text-gray-400 font-medium text-xs d-block mb-1">
                  {d?.category}
                </span>
                <h2 className="text-heading truncate mb-0 block text-sm font-medium text-gray-600">
                  <span className="line-clamp-2">{d?.title}</span>
                </h2>
              </div>
              <div className="flex justify-between items-center text-heading text-sm sm:text-base space-s-2 md:text-base lg:text-xl">
                <div className="product font-bold">
                  <span className="inline-block text-lg font-semibold text-rose-600">
                    Rs. {d?.price}
                  </span>
                  {d?.price === 0 ? (
                    ""
                  ) : (
                    <del className="sm:text-sm font-normal text-base text-gray-400 ml-1">
                      ${d?.price}
                    </del>
                  )}
                </div>

                <button
                  disabled={d.availableQty === 0 ? true : false}
                  onClick={() => {
                    if (d.availableQty > 0) {
                      addToCart(
                        d?.id,
                        1,
                        d?.price,
                        d?.title,
                        d?.size,
                        d?.color,
                        d?.mainImage,
                        d?.category
                      );
                      toast.success("Item added to cart!");
                    } else {
                      toast.warning("Sorry! Item is currently out of stock.");
                    }
                  }}
                  className={
                    d.availableQty === 0
                      ? "!cursor-default h-9 w-9 flex items-center justify-center border border-gray-200 rounded text-violet-500 hover:border-violet-500 hover:bg-violet-500 hover:text-white transition-all"
                      : "!cursor-pointer h-9 w-9 flex items-center justify-center border border-gray-200 rounded text-violet-500 hover:border-violet-500 hover:bg-violet-500 hover:text-white transition-all"
                  }
                >
                  <span className="text-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default RecommendCard;
