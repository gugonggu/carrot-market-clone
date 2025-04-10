"use client";

import { getMoreProducts } from "@/app/(tabs)/products/actions";
import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "@/components/list-product";
import { useEffect, useRef, useState } from "react";

interface ProductListProps {
  initialProducts: InitialProducts;
}

const ProductList = ({ initialProducts }: ProductListProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      { threshold: 1.0 }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="px-3 py-2 mx-auto text-sm font-semibold bg-orange-500 rounded-md w-fit hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "더보기"}
        </span>
      ) : null}
    </div>
  );
};
export default ProductList;
