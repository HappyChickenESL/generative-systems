export const Card = ({
  title,
  img,
  desc,
}: {
  title: string;
  img: string;
  desc: string;
}) => {
  return (
    <div className="card h-full bg-slate-300 w-80 shadow-sm border-slate-300 border-4 text-black">
      <figure className="h-60">
        <img src={img} alt="Placeholder" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
};
