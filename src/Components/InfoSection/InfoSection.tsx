import { InfoSectionProps } from "../../types/School";

const InfoSection: React.FC<InfoSectionProps> = ({ title, info }) => (
    <div className="pl-3 bg-[#f3f3f3] rounded-lg p-2">
      <h3 className="font-bold text-lg">{title}</h3>
      <div>
        {info.map((item, index) => (
          <p key={index} className="mb-2 ml-3">
            <span className="font-semibold">{item.label}:</span>{" "}
            {item.value}
          </p>
        ))}
      </div>
    </div>
  );
export default InfoSection;  