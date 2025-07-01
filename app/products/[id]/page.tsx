import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import getSession from "@/lib/session";

type ProductDetailProps = {
  params: { id: string };
};

const getIsOwner = async (userId: number) => {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
};

const getProduct = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
};

const getChchedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

const getProductTitle = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
};

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const product = await getCachedProductTitle(Number(params.id));

  return {
    title: product?.title,
  };
};

const ProductDetail = async ({ params }: any) => {
  const { id } = params as { id: string };
  const numId = Number(id);

  if (isNaN(numId)) {
    return notFound();
  }

  const product = await getChchedProduct(numId);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";

    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });

    redirect(`/chats/${room.id}`);
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 p-5 border-b border-neutral-700">
        <div className="overflow-hidden rounded-full size-10">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5 ">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-5 pb-10 bg-neutral-800">
        <span className="text-xl font-semibold">
          {formatToWon(product.price)}
        </span>
        {isOwner ? (
          <button className="p-5 py-2.5 font-semibold text-white bg-red-500 rounded-md">
            삭제하기
          </button>
        ) : null}
        <form action={createChatRoom}>
          <button className="p-5 py-2.5 font-semibold text-white bg-orange-500 rounded-md">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProductDetail;

export const generateStaticParams = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
};
