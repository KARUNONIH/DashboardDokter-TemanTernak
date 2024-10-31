const StepFLow = ({image, step, title, paragraf}) => {
    return (
        <div className="flex flex-col gap-4 shadow p-3">
            <section className="w-full bg-gray-100 pt-4 rounded-[2px]">
                <img src={`/asset/${image}`} alt="" className="rounded-t-[30px] w-1/2 mx-auto"/>
            </section>
            <section className="flex flex-col gap-3">
                <p className="px-2 py-1 bg-green-600/20 text-black inline text-xs font-semibold rounded-sm w-max">Step {step}</p>
                <h1 className="font-bold text-lg">{ title }</h1>
                <p className="text-sm text-gray-500">{ paragraf }</p>
            </section>
        </div>
    )
}

export default StepFLow;