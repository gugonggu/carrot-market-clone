import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getInitialProducts = async () => {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
};

const getCachedProducts = nextCache(getInitialProducts, ["products"], {
  revalidate: 60,
});

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Products",
};

export const revalidate = 60;

const Products = async () => {
  const initialProducts = await getCachedProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/products");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="fixed flex items-center justify-center text-white transition-colors bg-orange-500 rounded-full size-16 bottom-24 right-8 hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};
export default Products;
