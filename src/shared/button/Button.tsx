function Button({ name, action }) {
  //console.log(data);

  return (
    <>
      return (
      <div className="flex align-end justify-end">
        <button
          onClick={action}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          {name}
        </button>
      </div>
      );
    </>
  );
}

export default Button;
