import { Droppable } from "react-beautiful-dnd";

interface provided {
  show: boolean;
}
export function GanhouPerdeu({ show }: provided) {
  return (
    <div className=" relative z-custom envelopeTeste">
      <div
        className={` ${
          show ? "slide-up" : "slide-down"
        } z-custom fixed bottom-0 left-0 right-0 bg-transparent w-full indexCustom flex gap-2`}
      >
        <Droppable droppableId={"6"}>
          {(provided: any) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className=" z-custom  rounded-sm w-1/2 flex items-center justify-center h-20 customBorderDotted bg-white ml-2 transition-all duration-300 hover:bg-green-500 text-green-500 hover:text-white"
              >
                <p className="m-0 font-semibold text-lg">GANHOU</p>
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
        <Droppable droppableId={"7"}>
          {(provided: any) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className=" z-custom rounded-sm w-1/2 relative flex items-center justify-center h-20 customBorderDotted transition-all duration-300 text-red-500 bg-white hover:bg-red-500 hover:text-white"
              >
                <p className="m-0 font-semibold text-lg">PERDEU</p>
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    </div>
  );
}
