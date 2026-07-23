import { useParams } from "react-router-dom";

function ContactDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-lg font-semibold">Szczegóły kontaktu</h2>
      <p className="text-gray-600">TODO: szczegóły kontaktu o id = {id}.</p>
    </div>
  );
}

export default ContactDetails;
