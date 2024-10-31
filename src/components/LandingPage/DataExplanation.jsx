const DataExplanation = ({data, label}) => {
    return (
        <div className="">
            <section>
                <h1 className="text-xl font-semibold text-white">{ data }K<span className="text-green-300">+</span></h1>
                <p className="text-xs">{ label }</p>
            </section>
        </div>
    )
}

export default DataExplanation;