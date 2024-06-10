import React from "react";
import Input from "./Input";
import Button from "./Button";
import { BiSortAlt2 } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleList } from "react-icons/ci";
import { CgBoard } from "react-icons/cg";
const Header = () => {
  return (
    <>
      <div className="w-full h-auto flex flex-col gap-4 px-6 py-3">
        <h1 className="font-[600] text-[20px] text-[black]">Volunerabilities</h1>
        <div className="w-[full] flex justify-between gap-3">
          <div className="flex gap-3">
            <Input />
            <div className="flex gap-3 items-center">
              <Button
                className=" text-[12px] flex items-center"
                text="Sort By"
                Icon={BiSortAlt2}
              />
              <Button
                className=" text-[12px] flex items-center"
                text="Assigned To"
                Icon={IoIosAddCircleOutline}
              />
              <Button
                className=" text-[12px] flex items-center"
                text="Severity"
                Icon={IoIosAddCircleOutline}
              />
              <Button
                className=" text-[12px] flex items-center"
                text="Pentest"
                Icon={IoIosAddCircleOutline}
              />
              <Button
                className=" text-[12px] flex items-center"
                text="Target"
                Icon={IoIosAddCircleOutline}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className=" text-[12px] flex items-center"
              text="Board"
              Icon={CgBoard}
            />
            <Button
              className=" text-[12px] flex items-center"
              text="List"
              Icon={CiCircleList}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
