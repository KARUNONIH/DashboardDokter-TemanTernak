import ButtonModalFeature from "./ButtonModalFeature";

const TypeOfFeature = ({icon, header, paragraf, featureIndex}) => {
  return (
      <div className="px-2 py-4 shadow shadow-gray-300 rounded-sm flex flex-col gap-2">
          <span className="w-[30px] h-[30px] flex items-center justify-center bg-green-600/15">{icon}</span>
          <h1 className="text-lg font-semibold">{header}</h1>
          <p className="text-sm text-gray-400">{paragraf}</p>
          <ButtonModalFeature featureIndex={ featureIndex } />
    </div>
  );
};

export default TypeOfFeature;