import { ProgressSpinner } from "primereact/progressspinner";
const LoadingFullPage = () => {
  return (
    <div
      className="w-screen h-screen flex flex-column align-items-center justify-content-center"
      style={{ width: "100%", height: "100%" }}
    >
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-border)"
        animationDuration=".5s"
      ></ProgressSpinner>
      <div className="mt-2 text-xs">Loading</div>
    </div>
  );
};
export default LoadingFullPage;
