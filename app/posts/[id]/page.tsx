import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";

type PostDetailProps = {
  params: Promise<{ id: string }>;
};

const getPost = async (id: number) => {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
};

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: [`post-detail`],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOperation = nextCache(
    (postId) => getLikeStatus(postId, userId),
    ["product-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation(postId);
}

const PostDetail = async ({ params }: PostDetailProps) => {
  const { id } = await params;
  // const id = await Number(params.id);
  const numId = Number(id);
  if (isNaN(numId)) {
    return notFound();
  }

  const post = await getCachedPost(numId);
  if (!post) {
    return notFound();
  }

  const session = await getSession();
  const { likeCount, isLiked } = await getCachedLikeStatus(numId, session.id!);

  return (
    <div className="p-5 text-white">
      More actions
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="rounded-full size-7"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={numId} />
      </div>
    </div>
  );
};
export default PostDetail;
