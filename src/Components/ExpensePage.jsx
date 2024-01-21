import React, { useEffect, useRef, useState } from "react";
import {
  deleteDataFromFirebase,
  editDataInFirebase,
  getDataFromFirebase,
  postDataOnFirebase,
  totalExpenseFun,
} from "../Redux/expenseSlice";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

export default function ExpensePage() {
  const expenseAmount = useRef(null);
  const description = useRef(null);
  const category = useRef(null);
  const date = useRef(null);

  const dispatch = useDispatch();

  const [Expenses, setNewExp] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editedExpenseId, setEditedExpenseId] = useState(null);
  const [editedExpenseObj, setEditedExpense] = useState(null);

  const editHandler = (expen) => {
    setEdit(true);
    expenseAmount.current.value = expen.expAmt;
    description.current.value = expen.desc;
    category.current.value = expen.categ;
    date.current.value = expen.date;
    setEditedExpenseId(expen.firebaseId);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (edit) {
      const updatedValues = {
        expAmt: expenseAmount.current.value,
        desc: description.current.value,
        categ: category.current.value,
        date: date.current.value,
        firebaseId: editedExpenseId,
      };
      setEditedExpense(updatedValues);
      const updatedArray = Expenses.map((item) => {
        if (item.firebaseId === updatedValues.firebaseId) {
          return updatedValues;
        }
        return item;
      });
      setNewExp(updatedArray);
    } else {
      const obj = {
        expAmt: expenseAmount.current.value,
        desc: description.current.value,
        categ: category.current.value,
        date: date.current.value,
      };

      dispatch(postDataOnFirebase(obj));
      setNewExp((prevExpenses) => [...prevExpenses, obj]);
    }
    setEdit(false);
  };

  if (editedExpenseObj && editedExpenseId) {
    // console.log(
    //   "editedExpenseObj==>",
    //   editedExpenseObj,
    //   " || editedExpenseId==> ",
    //   editedExpenseId
    // );

    dispatch(editDataInFirebase(editedExpenseObj));
  }
  useEffect(() => {
    dispatch(getDataFromFirebase());
  }, []);

  const { expFromDB: exp } = useSelector((state) => {
    return state.exp;
  });

  useEffect(() => {
    setNewExp(exp);
  }, [exp]);

  // const sumTotalExpense = (expense) => {
  // const total = expense.reduce((acc, exp) => acc + parseFloat(exp.expAmt), 0);
  // console.log(" total ",total);

  // return total.toFixed(2);
  // };

  const [total, setTotal] = useState(0);
  useEffect(() => {
    const calculatedTotal = Expenses.reduce(
      (acc, exp) => acc + parseFloat(exp.expAmt),
      0
    );
    // console.log("calculatedTotal", calculatedTotal);

    dispatch(totalExpenseFun(calculatedTotal));

    setTotal(calculatedTotal);
  }, [Expenses, dispatch]);

  // console.log("Value of total outside the function", total);

  const deleteHandler = (exp) => {
    dispatch(deleteDataFromFirebase(exp.firebaseId));

    setNewExp((prevExpenses) => {
      const updatedExpenses = prevExpenses.filter(
        (ex) => ex.firebaseId !== exp.firebaseId
      );

      return updatedExpenses;
    });
  };
  // let sumOfAllExpense = sumTotalExpense(Expenses);
  // console.log("sum all", sumOfAllExpense);

  // if (sumTotalExpense(Expenses) > 10000) {
  //   console.log("upper dispatch");
  //   dispatch(totalExpenseFun(sumTotalExpense(Expenses)));
  //   console.log("niche dispatch");
  // }

  const cancelEdit = () => {
    expenseAmount.current.value = null;
    description.current.value = null;
    category.current.value = null;
    date.current.value = null;
    setEdit(false);
  };

  const toggleThemeStatus = useSelector((state) => state.theme.isDarkMode);
  // console.log("toggleThemeStatus in expensepage ",toggleThemeStatus);

  const downloadExpense = () => {
    console.log("Inside download expense ");
    const svgData = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="20" font-family="Arial" font-size="14" fill="black">
        Expense Details:
      </text>
      ${Expenses.map((exp, index) => `
        <text x="10" y="${40 + 20 * index}" font-family="Arial" font-size="12" fill="black">
          ${exp.date}: Rs.${exp.expAmt} - ${exp.desc}
        </text>
      `).join('')}
    </svg>
  `;

  const blob = new Blob([svgData], { type: "image/svg+xml" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  };

  return (
    <>
      {/* EXPENSE FORM TO ENTER EXPENSE */}
      <div
        className={` ${
          toggleThemeStatus ? "bg-slate-800" : "bg-slate-100"
        }  flex justify-start `}
      >
        <br />
        {/* LEFT  EXP FORM */}
        <div
          className={` ${
            toggleThemeStatus ? "bg-slate-600" : "bg-neutral-100 "
          } mr-[40%] ml-3 mt-10 shadow-2xl   w-[35%] h-[310px] max-h-[500px] rounded-xl p-2 `}
        >
          <form action="submit" onSubmit={submitHandler}>
            <input
              className="mx-7 rounded-2xl   shadow-inner mt-3 bg-slate-200 p-2 text-xl  font-serif w-[90%] "
              placeholder="Enter Expense Amount"
              type="number"
              required
              ref={expenseAmount}
            />
            <br />

            <input
              className="mx-7 rounded-2xl mt-3 mb-3  shadow-inner bg-slate-200 p-2 text-xl font-serif w-[90%] "
              type="text"
              placeholder="Description of Expense"
              ref={description}
              required
            />
            <br />
            <label
              className="mx-7 mb-1 mt-0 rounded-xl   shadow-inner bg-slate-200 p-2 text-xl font-serif w-[90%] "
              htmlFor="cars"
            >
              Category:
            </label>
            <select
              className=" mb-1  rounded-xl   shadow-inner bg-slate-200 p-2 text-xl font-serif w-[20%]"
              ref={category}
              name="cars"
              id="cars"
            >
              <option value="food">Food</option>
              <option value="petrol">Petrol</option>
              <option value="party">Party</option>
              <option value="others">Others</option>
            </select>
            <br />
            <input
              className="mx-7 rounded-2xl mt-3  shadow-inner bg-slate-200 p-2 text-xl font-serif w-[90%] "
              required
              ref={date}
              type="date"
              placeholder="dd-mm-yyyy"
            />
            <br />
            {edit ? (
              <>
                <button
                  type="submit"
                  className="mt-3  ml-[35%] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Submit Edited Value
                </button>
                <button
                  type="submit"
                  className="bg-red-500 mr-2 p-1 w-9 rounded-lg"
                  onClick={cancelEdit}
                >
                  X
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="mt-3  ml-[35%] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Add Expenses
              </button>
            )}
          </form>
        </div>
        {/* EXPENSE TOTAL RIGHT ,  SUM UP*/}

        <div className="max-h-fit h-fit bg-neutral-100 mt-8 hover:p-10 hover:bg-slate-50 w-auto max-w-fit  shadow-2xl rounded-xl p-4">
          <h1 className="text-2xl  font-semibold hover:text-3xl hover:text-green-950 p-2 underline">
            Total Expenses
          </h1>
          <p className="w-[90%] h-9 rounded-xl p-1 text-center bg-gradient-to-r from-orange-300 via-gray-600 to-green-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80  text-white font-semibold  bg-green-400 m-auto text-xl hover:cursor-not-allowed">
            {/* {sumTotalExpense(Expenses)} */}
            {total}
          </p>
        </div>

        {/* {sumTotalExpense(Expenses) > 10000 && ( */}
        {total >= 10000 && (
          <>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  h-10 mt-8 mx-2 mb-2"
            >
              Premium
            </button>
            <button
              type="button"
              onClick={downloadExpense}
              className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm h-14 w-fit mt-6 px-5 text-center me-2 mb-2"
            >
              Download Expense
            </button>
          </>
        )}
      </div>

      {/* CURRENT EXPENSE LEFT DOWN  */}
      <div
        className={` ${
          toggleThemeStatus ? "bg-slate-800 max-h-full" : "bg-neutral-100 "
        }  pt-1`}
      >
        {Expenses.length > 0 &&
          Expenses.map((exp) => (
            <div
              key={exp.firebaseId || nanoid()}
              className="max-h-fit h-fit bg-slate-400 bg-opacity-30 mt-8  hover:bg-slate-50 w-auto max-w-fit   shadow-inner mx-5 rounded-md p-5"
            >
              <span className="h-[90%] bg-teal-800 p-2 rounded-xl mr-3 text-xl font-semibold text-white">
                {exp.date}
              </span>
              <span className="h-[90%] bg-teal-800 p-2 rounded-xl mr-3 text-xl font-medium text-white">
                Rs.{exp.expAmt}- {exp.desc}
              </span>
              <button
                onClick={() => editHandler(exp)}
                type="button"
                className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-3"
              >
                Edit
              </button>

              <button
                onClick={() => deleteHandler(exp)}
                type="button"
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
