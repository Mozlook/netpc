import { useParams } from "react-router-dom";

function ContactForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;

  return (
    <div>
      <h2 className="text-lg font-semibold">
        {isEdit ? "Edycja kontaktu" : "Nowy kontakt"}
      </h2>
      <p className="text-gray-600">
        TODO: formularz{" "}
        {isEdit ? `edycji kontaktu o id = ${id}` : "tworzenia kontaktu"}.
      </p>
    </div>
  );
}

export default ContactForm;
