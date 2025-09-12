import ReactFlowCanvas from "../src/app/ReactFlowCanvas";

export default function WrappedCanvas(props: any) {
  return (
    <div className="h-full w-full">
      <ReactFlowCanvas {...props} />
    </div>
  );
}