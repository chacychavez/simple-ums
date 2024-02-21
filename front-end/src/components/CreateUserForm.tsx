import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../types/user";
import { postUser } from "../services/api";

interface IFormInput {
    first_name: string;
    last_name: string;
    email: string;
    job: string;
}

interface CreateUserFormProps {
    closeModal: () => void;
    onUserCreate: (user: User) => void;
}

function CreateUserForm({ closeModal, onUserCreate }: CreateUserFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();

    const onClose = () => {
        reset();
        closeModal();
    }
    

    const { mutate: createUser, isPending: isCreating } = useMutation({
        mutationFn: postUser,
        onSuccess: (res: User) => {
            // Invalidate and refetch
            // queryClient.invalidateQueries({ queryKey: ['todos'] })
            onUserCreate(res)
            onClose();
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data: Partial<User>) => createUser(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <h1 className="text-2xl text-center">Create User</h1>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="First Name" {...register("first_name", { required: true })} />
                    </label>
                    {errors?.first_name?.type === "required" && <p className="mt-1 ml-2 text-error text-sm">This field is required</p>}
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Last Name" {...register("last_name", { required: true })} />
                    </label>
                    {errors?.last_name?.type === "required" && <p className="mt-1 ml-2 text-error text-sm">This field is required</p>}
                </div>
            </div>
            <label className="mt-4 input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                <input type="text" className="grow" placeholder="Email" {...register("email", { required: true })} />
            </label>
            {errors?.email?.type === "required" && <p className="mt-1 ml-2 text-error text-sm">This field is required</p>}
            <label className="mt-4 input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                <input type="text" className="grow" placeholder="Job" {...register("job", { required: true })} />
            </label>
            {errors?.job?.type === "required" && <p className="mt-1 ml-2 text-error text-sm">This field is required</p>}
            <div className="modal-action">
                {isCreating ?
                    <p className="flex items-center gap-2"><span className="loading loading-spinner loading" />Creating user</p> :
                    <>
                        <button className="btn" type="submit">Create</button>
                        <button className="btn" type="button" onClick={onClose}>Close</button>
                    </>
                }
          </div>
        </form>
    );
}

export default CreateUserForm;