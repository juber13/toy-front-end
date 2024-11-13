
import { useState } from "react";
import ToyForm from "../../Components/ToyFrom/ToyForm";
import { IToy } from "../../types/School";

const AddToy: React.FC = () => {
  const [toy, setToy] = useState<IToy>();
  return (
    <ToyForm title="Add Toy" toy={toy} setToy={setToy} />
  )
};

export default AddToy;
