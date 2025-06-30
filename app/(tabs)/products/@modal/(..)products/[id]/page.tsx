"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const Modal = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const onCloseCLick = () => {
    router.back();
  };

  return (
    <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
      <button
        onClick={onCloseCLick}
        className="absolute right-5 top-5 text-neutral-200"
      >
        <XMarkIcon className="size-10" />
      </button>
      <div className="flex justify-center w-full max-w-screen-sm h-1/2">
        <div className="flex items-center justify-center rounded-md aspect-square bg-neutral-700 text-neutral-200">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
};
export default Modal;
