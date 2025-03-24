import { Button } from "../../components/ui/button.tsx";

function Card({ image, title, description, show_action, on_edit, on_delete }) {
  //console.log(data);

  return (
    <>
      <div className="bg-white p-4 shadow-md outline outline-black/5 rounded-lg ">
        <div className="h-40 w-full overflow-hidden rounded-md">
          <img src={image} className="w-full h-full object-cover" />
        </div>
        <p className="text-lg font-bold py-3">{title}</p>
        <p className="text-lg font-light max-h-20 overflow-y-auto py-1">{description}</p>

        {show_action ? (
          <div className="flex gap-2 pt-3">
            <Button onClick={on_edit} className="cursor-pointer">Edit</Button>
            <Button variant="destructive" onClick={on_delete} className="cursor-pointer">
              Delete
            </Button>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}

export default Card;
