import { BlockUI } from "primereact/blockui";
const BlockFullPage = ({blocked, children}) => {
    return (
        <BlockUI blocked={blocked} containerClassName="h-full">
            {{children}}
        </BlockUI>
    );
};
export default BlockFullPage;