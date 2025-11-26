import CardsPosts from "../components/CardsPosts/CardsPosts";
import Search from "../components/Search/Search";

export default function Home() {
  return (
    <div>
      <h2 className="!p-8 !text-2xl font-bold">Principais temas</h2>
      <div className="w-full flex flex-col items-center">
        <CardsPosts/>
      </div>
    </div>
  );
}
