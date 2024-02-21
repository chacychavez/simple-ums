import { User } from "../types/user";

interface UserItemProps {
    user: User;
    openUserDetails?: (user: User) => void
}

function UserItem({user, openUserDetails}: UserItemProps) { 
    const handleViewClick = () => {
        if(openUserDetails)
            openUserDetails(user)
    }

    return (
        <div className="card card-side bg-neutral shadow-xl">
            <figure><img src={user.avatar ?? `https://eu.ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&size=128`} alt="avatar" className="h-full"/></figure>
            <div className="card-body min-w-[300px]">
                <h2 className="card-title">{user.first_name} {user.last_name}</h2>
                <p>{user.email}</p>
                <p>{user.job}</p>
                {openUserDetails &&
                    <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-secondary" onClick={handleViewClick}>View</button>
                    </div>
                }
            </div>
        </div>
  )
}

export default UserItem;