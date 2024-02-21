import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { User } from "./types/user";
import UserItem from "./components/UserItem";
import CreateUserForm from "./components/CreateUserForm";
import { getUsers } from "./services/api";

function App() {
  const viewModalRef = useRef<HTMLDialogElement>(null);
  const createModalRef = useRef<HTMLDialogElement>(null);
  const [currUsers, setCurrUsers] = useState<User[]>([]);
  const [currUser, setCurrUser] = useState<User>();
  const [currPage, setCurrPage] = useState<number>(1);

  const { data: usersData, error, isLoading } = useQuery({ queryKey: ['todos', currPage], queryFn: () => getUsers(currPage) });

  useEffect(() => {
    if(usersData?.data) 
      setCurrUsers(usersData.data)
  }, [usersData]);

  const openUserDetails = (user: User) => {
    setCurrUser(user)
    if(viewModalRef.current) {
      viewModalRef.current.showModal();
    }
  }

  const openCreateUser = () => {
    if(createModalRef.current) {
      createModalRef.current.showModal();
    }
  }

  const closeCreateUser = () => {
    if(createModalRef.current) {
      createModalRef.current.close();
    }
  }

  const addUser = (user: User) => {
    setCurrUsers(_currUsers => [..._currUsers, user])
  }
  
  const onPageClick = (page: number) => () => {
    setCurrPage(page)
  }

  return (
    <div className="p-6">
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">Welcome to ReqRes.in UMS!</h1>
      </div>

      {isLoading && <div className="mt-6 w-full flex justify-center"><span className="loading loading-spinner loading" /></div>}

      {error && <div className="mt-6 w-full flex justify-center"><h1 className="text-2xl">Error occured: {error.message}</h1></div>}

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {currUsers.map(user => (
          <UserItem key={user.id} user={user} openUserDetails={openUserDetails} />
        ))}
      </div>

      <div className="w-full mt-6 flex justify-center">
        <div className="join">
          {usersData && 
            [...Array(usersData.total_pages).keys()].map(p => 
            <button key={p} className={`join-item btn ${p + 1 === usersData.page && "btn-active"}`} onClick={onPageClick(p + 1)}>{p + 1}</button>
          )}
        </div>
      </div>

      <div className="mt-6 w-full flex justify-center">
        <button className="btn btn-primary" onClick={openCreateUser}>Create User</button>
      </div>

      <dialog ref={viewModalRef} className="modal">
        <div className="modal-box">          
          {currUser && <UserItem user={currUser}/>}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog ref={createModalRef} className="modal">
        <div className="modal-box">
          <CreateUserForm closeModal={closeCreateUser} onUserCreate={addUser}/>
        </div>
      </dialog>

    </div>
  )
}

export default App
