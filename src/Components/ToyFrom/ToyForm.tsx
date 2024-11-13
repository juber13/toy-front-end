import { useState } from "react";
import Loading from "../../Components/Loading/Loading";
import { setError, setLoading } from "../../redux/slices/statusSlice";
import { useDispatch } from "react-redux";
import { ADD_TOY, UPDATE_TOY_BY_ID } from "../../utils/restEndPoints";
import { IToy, Level } from "../../types/School";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ToyFormProps {
  title: string;
  toy: IToy | undefined;
  setToy: React.Dispatch<React.SetStateAction<IToy | undefined>>;
}

const ToyForm: React.FC<ToyFormProps> = ({ title, toy, setToy }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let v: string | number = value;

    if (name == 'price') {
      v = parseInt(value);
    }
    setToy((prev) => {
      if (!prev) {
        return ({ [name]: v });
      } else {
        return ({ ...prev, [name]: v });
      }
    })
  };

  const handleArray = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setToy(prev => {
        return prev ? ({ ...prev, learn: [...(prev.learn ?? []), inputValue] }) : ({ learn: [inputValue] });
      });
      setInputValue(""); // Clear input after adding
    }
  };


  const createToy = async () => {
    try {
      if(!validateToyDetails(toy)) return;
      dispatch(setLoading(true));
      await axiosInstance.post(ADD_TOY, { toy });
       setToy({
         name: "",
         brand: "",
         price: 0,
         category: "",
         codeName: "",
         cataloguePgNo: 0,
         subBrand: "",
         level: Level.ALL,
         learn: [],
         link: "",
       });

       // Also clear the input value for the learn field
       setInputValue("");
      toast.success("Toy added successfully!");

    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeLearnTopic = (givenIndex: number) => {
    setToy(prev => {
      if (!prev) return prev;
      const learn = prev.learn?.filter((_, index) => index != givenIndex);
      return {
        ...prev,
        learn: [...(learn ?? [])]
      };
    })
  }

  function validateToyDetails(toy: IToy | undefined): boolean {
    if (!toy) {
      toast.error("Please Provide the details of toy.");
      return false;
    }

    const requiredFields: (keyof IToy)[] = ['name', 'brand', 'price', 'category', 'codeName', 'cataloguePgNo', 'subBrand', 'level', 'link'];

    for (const field of requiredFields) {
      if (!toy[field] || (typeof toy[field] === 'string' && toy[field].trim() === '')) {
        toast.error(`Please enter toy details for ${field}`);
        return false;
      }
    }

    if (!toy.learn || toy.learn.length === 0) {
      toast.error("Please add at least one learning topic");
      return false;
    }

    return true;
}

  // function validateToyDetails(toy: IToy | undefined): boolean {
  //   if (!toy) {
  //     toast.error("Toy details are undefined");
  //     return false; // Return false if toy is undefined
  //   }

  //   // Iterate over the keys of IToy
  //   for (const key of Object.keys(toy) as Array<keyof IToy>) {
  //     if (toy[key] === "") {
  //       toast.error("Please enter toy details for " + key);
  //       return false; // Return false to indicate validation failure
  //     }
  //   }

  //   return true; // Return true if all details are valid
  // }

  //  update toy by id
  const updateToy = async () => {
    try {
      if(!validateToyDetails(toy)) return;
      dispatch(setLoading(true));
      await axiosInstance.put(`${UPDATE_TOY_BY_ID}`, { toy: { ...toy } });
      toast.success("Toy updated successfully!");
    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Loading>
      <div className='w-full pb-10'>
        <div
          className={`${title === "Add Toy" ? "mt-6" : "mt-3"
            } p-8 border-2  shadow-xl rounded-xl max-w-xl m-auto`}
        >
          <h3 className='text-4xl mb-2 ml-3 font-semibold'>{title}</h3>
          <div className='p-4 flex flex-col gap-3'>
            {/* Input fields */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='brand' className='text-sm font-semibold '>
                  Toy Name
                </label>
                <input
                  type='text'
                  placeholder='Name....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='name'
                  onChange={handleChange}
                  value={toy?.name || ""}
                  required
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='subBrand' className='text-sm font-semibold'>
                  Brand
                </label>
                <input
                  type='text'
                  placeholder='brand....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='brand'
                  onChange={handleChange}
                  value={toy?.brand || ""}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='price' className='text-sm font-semibold'>
                  Price
                </label>
                <input
                  type='number'
                  placeholder='Price....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='price'
                  onChange={handleChange}
                  value={toy?.price || 0}
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='category' className='text-sm font-semibold'>
                  Category
                </label>
                <input
                  type='text'
                  name='category'
                  className='border p-2 outline-none text-sm rounded-md'
                  onChange={handleChange}
                  value={toy?.category || ""}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='codeName' className='text-sm font-semibold'>
                  CodeName
                </label>
                <input
                  type='text'
                  placeholder='CodeName....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='codeName'
                  onChange={handleChange}
                  value={toy?.codeName || ""}
                  required
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='cataloguePgNo'
                  className='text-sm font-semibold'
                >
                  Catalogue Page No
                </label>
                <input
                  type='text'
                  placeholder='Catalogue Pg No....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='cataloguePgNo'
                  onChange={handleChange}
                  value={toy?.cataloguePgNo || ""}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3  '>
              <div className='flex flex-col'>
                <label htmlFor='subBrand' className='text-sm font-semibold'>
                  SubBrand
                </label>
                <input
                  type='text'
                  placeholder='SubBrand....'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='subBrand'
                  onChange={handleChange}
                  value={toy?.subBrand || ""}
                  required
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='level' className='text-sm font-semibold'>
                  Level
                </label>
                <select
                  name='level'
                  className='text-xs p-2 rounded-md outline-none border'
                  onChange={handleChange}
                  value={toy?.level || ""}
                  required
                >
                  {Object.keys(Level).map((level) => (
                    <option value={level} key={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 w-full'>
              <label htmlFor='' className='text-sm font-semibold'>
                Learn
              </label>
              <div className='flex flex-wrap gap-2'>
                {toy?.learn?.map((item, index) => (
                  <div
                    key={index}
                    className='border bg-white p-1 relative rounded-md shadow-sm cursor-pointer'
                    onClick={() => removeLearnTopic(index)}
                  >
                    <span className='text-xs'>{item}</span>
                    <IoIosCloseCircleOutline className='absolute bottom-6 right-0 text-sm' />
                  </div>
                ))}
                <input
                  type='text'
                  placeholder='Press enter to add learn....'
                  className='border p-2 outline-none text-sm rounded-md w-full'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  name='learn'
                  onKeyDown={handleArray}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 items-center'>
              <div className='flex flex-col'>
                <label htmlFor='link' className='text-sm font-semibold'>
                  Link
                </label>
                <input
                  type='url'
                  placeholder='Link...'
                  className='border p-2 outline-none text-sm rounded-md'
                  name='link'
                  onChange={handleChange}
                  value={toy?.link || ""}
                  required
                />
              </div>
              <button
                className='border p-2 bg-green-500 text-white rounded-md mt-5 cursor-pointer text-sm'
                onClick={title === "Add Toy" ? createToy : updateToy}
              >
                {title.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default ToyForm