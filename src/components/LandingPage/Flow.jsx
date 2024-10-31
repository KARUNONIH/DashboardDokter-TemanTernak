import Button from "./Button";
import { IoMdDownload } from "react-icons/io";
import StepFLow from "./StepFlow";

const Flow = () => {
    return (
        <div className="w-4/5 mx-auto">
            <div className="flex">
                <section className="flex-1 pr-8">
                    <h1 className="text-3xl leading-snug font-medium">Konsultasi Tanpa Harus Bertemu Dokter Hewan Secara Langsung</h1>
                </section>
                <section className="flex-1">
                    <p className="text-gray-500 text-sm mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum iusto corporis minima repudiandae, eos exercitationem ea iste consequuntur temporibus consectetur ad quos molestias dolorem assumenda, id doloremque?</p>
                    <Button color={"green"} label={"download app"} icon={<IoMdDownload/>} className={"gap-2"}/>
                </section>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
                <StepFLow image={"flow.png"} step={1} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
                <StepFLow image={"flow.png"} step={2} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
                <StepFLow image={"flow.png"} step={3} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
                <StepFLow image={"flow.png"} step={4} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
                <StepFLow image={"flow.png"} step={5} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
                <StepFLow image={"flow.png"} step={6} title={"Lorem ipsum dolor sit amet, consectetur adipisicing elit."} paragraf={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus totam dolor voluptas eligendi explicabo distinctio aperiam, quae mollitia quam omnis placeat. Illo corporis consectetur laudantium!"}/>
            </div>
        </div>
    )
}

export default Flow;