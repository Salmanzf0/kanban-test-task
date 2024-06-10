import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaFire, FaPlus } from "react-icons/fa6";
import Header from "./Header";
import { LuDot } from "react-icons/lu";
import { ImSpinner3 } from "react-icons/im";
import { MdVerified } from "react-icons/md";
import { FaGgCircle } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CustomKanban = () => {
  return (
    <div className="h-screen w-full  text-black">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState({
    solved: [],
    unsolved: [],
    drafts: [],
    underReview: [],
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      const response = await axios.get(
        "https://kanban-test-task-be.vercel.app/api/task/all",
        config
      );
      const tasks = response.data.tasks;

      const categorizedCards = {
        solved: tasks.filter((task) => task.status === "solved"),
        unsolved: tasks.filter((task) => task.status === "unsolved"),
        drafts: tasks.filter((task) => task.status === "drafts"),
        underReview: tasks.filter((task) => task.status === "under review"),
      };

      setCards(categorizedCards);
      console.log("Categorized cards: ", categorizedCards);
    } catch (error) {
      console.error("Error fetching cards:", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex w-full h-full bg-white gap-3 p-12">
        <Column
          title={
            <div className="flex items-center">
              <LuDot className="text-[30px] text-[gray]" />
              <span className="text-black">Drafts</span>
            </div>
          }
          column="drafts"
          headingColor="text-neutral-500"
          cards={cards.drafts}
          setCards={setCards}
        />

        <Column
          title={
            <div className="flex items-center">
              <LuDot className="text-[30px] text-[blue]" />
              <span className="text-black">Unsolved</span>
            </div>
          }
          column="unsolved"
          headingColor="text-yellow-200"
          cards={cards.unsolved}
          setCards={setCards}
        />

        <Column
          title={
            <div className="flex items-center">
              <LuDot className="text-[30px] text-[orange]" />
              <span className="text-black">Under Review</span>
            </div>
          }
          column="underReview"
          headingColor="text-blue-200"
          cards={cards.underReview}
          setCards={setCards}
        />

        <Column
          title={
            <div className="flex items-center">
              <LuDot className="text-[30px] text-[green]" />
              <span className="text-black">Solved</span>
            </div>
          }
          column="solved"
          headingColor="text-emerald-200"
          cards={cards.solved}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    </>
  );
};

const Column = ({ title, headingColor, column, cards, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c._id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c._id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el._id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  return (
    <div className="w-[24%] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className={`font-medium ${headingColor}`}>{title}</h3>
          <span className="rounded text-sm pl-3 text-neutral-400">
            {cards.length}
          </span>
        </div>
        <div className="flex gap-2">
          <PiDotsThreeBold className="text-[black]" />
          <FaPlus className="text-[black]" />
        </div>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-100/50" : "bg-neutral-800/0"
        }`}
      >
        {cards.map((c) => (
          <Card
            key={c._id}
            card={c}
            column={column}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ handleDragStart, column, card }) => {
  return (
    <>
      <DropIndicator beforeId={card._id} column={column} />
      <motion.div
        layout
        layoutId={card._id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, card)}
        className="cursor-grab rounded border h-auto active:cursor-grabbing"
      >
        <div className="w-full shadow-md rounded-md h-auto px-3 py-3 border border-[1px lightgray]">
          <div className="flex justify-between items-center flex-wrap">
            <div className="flex">
              <span className="text-[#373737] font-[400]">
                {card?.taskName}
              </span>
              <span className="">
                <LuDot className="text-[30px] text-[gray]" />
              </span>
              <span className="text-[#373737] font-[400]">
                {card?.startDate && new Date(card.startDate).toLocaleString()}
              </span>
            </div>
            <div className="text-[black]">
              <FaGgCircle />
            </div>
          </div>
          <div>
            <p className="font-[600] py-2 text-[black]">
              {card?.taskDescription}
            </p>
          </div>
          <div className="flex justify-between mt-2 items-center">
            <div className="flex gap-1">
              <span className="bg-red-500 text-white rounded-2xl flex items-center justify-center px-4 py-1 max-w-[70px] truncate overflow-hidden">
                {card?.priority}
              </span>
              <span className="bg-orange-500 text-white rounded-2xl flex items-center justify-center max-w-[70px] truncate overflow-hidden px-3 py-0">
                {card?.category}
              </span>
              <div className="flex gap-1 items-center">
                <span>
                  <ImSpinner3 className="text-[25px] text-[gray]" />
                </span>
                <span className="text-[22px] font-[500] text-[black]">8.4</span>
              </div>
            </div>
            <div>
              {card.status === "solved" ? (
                <MdVerified className="text-[22px] text-[blue]" />
              ) : (
                <MdVerified className="text-[22px]" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setActive(false);

    const cardId = e.dataTransfer.getData("cardId");
    console.log(cardId);
    if (!cardId) {
      toast.error("No card ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://kanban-test-task-be.vercel.app/api/task/delete/${cardId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      toast.success("Card deleted successfully!");
      setCards((prevState) => ({
        ...prevState,
        drafts: prevState.drafts.filter((card) => card._id !== cardId),
        unsolved: prevState.unsolved.filter((card) => card._id !== cardId),
        underReview: prevState.underReview.filter(
          (card) => card._id !== cardId
        ),
        solved: prevState.solved.filter((card) => card._id !== cardId),
      }));
    } catch (error) {
      toast.error("Failed to delete card. Please try again.");
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-12 grid h-10 w-10 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 text-neutral-500"
      }`}
    >
      {active ? (
        <FaFire className="animate-bounce" />
      ) : (
        <FiTrash className="text-[20px]" />
      )}
    </div>
  );
};
const AddCard = ({ setCards }) => {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState({
    taskLabel: "",
    taskName: "",
    taskDescription: "",
    priority: "",
    category: "",
    tags: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  // const [taskcard, setTaskCards] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setText((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(false);

    const newCard = {
      taskLabel: text.taskLabel,
      status: text.status,
      startDate: text.startDate,
      endDate: text.endDate,
      taskName: text.taskName,
      taskDescription: text.taskDescription,
      category: text.category,
      tags: text.tags.split(",").map((tag) => tag.trim()),
      priority: text.priority,
    };

    try {
      const token = localStorage.getItem("token");
      console.log(token);

      if (token) {
        const response = await axios.post(
          "https://kanban-test-task-be.vercel.app/api/task/create",
          newCard,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        console.log(response);
        if (response.status === 201) {
          const result = response.data.task;
          setTimeout(() => {
            toast.success(response.data.message);
          }, 1000);

          setCards((prevState) => ({
            ...prevState,
            drafts: [...prevState.drafts, result],
            unsolved: [...prevState.unsolved, result],
            underReview: [...prevState.underReview, result],
            solved: [...prevState.solved, result],
          }));


        } else {
          throw new Error(
            `Failed to save the task: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving the task:", error.message);
    }

    setText({
      taskLabel: "",
      taskName: "",
      taskDescription: "",
      priority: "",
      category: "",
      tags: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  };

  return (
    <>
      <ToastContainer />
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <div className="w-full rounded border border-violet-400 bg-violet-400/20 p-3">
            <input
              type="text"
              placeholder="Task Label"
              name="taskLabel"
              value={text.taskLabel}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Status"
              name="status"
              value={text.status}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="date"
              placeholder="Start Date"
              name="startDate"
              value={text.startDate}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="date"
              placeholder="End Date"
              name="endDate"
              value={text.endDate}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Task Name"
              name="taskName"
              value={text.taskName}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Task Description"
              name="taskDescription"
              value={text.taskDescription}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={text.category}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              name="tags"
              value={text.tags}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <input
              type="text"
              placeholder="Priority"
              name="priority"
              value={text.priority}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-sm text-[black] placeholder-violet-300 focus:outline-0"
            />
            <button
              type="submit"
              className="w-full p-2 mt-3 rounded bg-violet-400 text-[black] focus:outline-0"
            >
              Submit
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-[black] transition-colors ="
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-[black] transition-colors "
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-black-400 transition-colors"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};
