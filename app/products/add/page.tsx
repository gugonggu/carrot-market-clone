"use client";

import { uploadProduct } from "@/app/products/add/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AddProduct = () => {
  const [preview, setPreview] = useState("");
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div>
      <form action={uploadProduct} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="flex flex-col items-center justify-center bg-center bg-cover border-2 border-dashed rounded-md cursor-pointer aspect-square text-neutral-300 border-neutral-300"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-sm text-neutral-400">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
};
export default AddProduct;
