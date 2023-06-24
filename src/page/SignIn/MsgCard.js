import Card from "../../components/UI/Card/Card";
const MsgCard = (props) => {
  return (
    <Card className="flex justify-content-center bg-gray-900 opacity-90">
      <p className="mr-2 text-green-50 opacity-100">New to XXX ?</p>
      <p className="cursor-pointer text-yellow-400">Create an account</p>
    </Card>
  );
};
export default MsgCard;
