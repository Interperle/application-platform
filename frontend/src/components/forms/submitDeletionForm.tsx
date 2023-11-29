"use client"

import { deleteUser } from "@/actions/auth";
import { closePopup } from "@/store/slices/popupSlice";
import { useAppDispatch } from "@/store/store";

export default function SubmitDeletionForm(){
    const dispatch = useAppDispatch()
    const handleDelete = () => {
        dispatch(closePopup())
        deleteUser()
    };
  return (
    <div>
        <form action={deleteUser}>
            <h4 className="py-2 text-xl mb-3">Löschen bestätigen</h4>
            <div>Bist du dir sicher, dass du diesen User löschen willst?</div>
            <button
                type="submit"
                className="apl-alert-button-fixed mt-3"
                onClick={handleDelete}
            >
                Account löschen
            </button>
        </form>
    </div>
  );
}
