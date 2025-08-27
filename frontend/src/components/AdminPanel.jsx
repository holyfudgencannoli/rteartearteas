import getCookie from "./CookieGetter";

export default function AdminPanel() {

    const handleClick = () => {
        const csrfToken = getCookie('csrf_token')
        const confirmed = window.confirm("Are you sure? This will delete all data!")
        if (confirmed){
            fetch("http://localhost:5000/api/delete-db", {
                method: "POST", 
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include"
             })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to reset DB!");
                    alert('Database reset successfully')
                })
                .catch(err => alert("Error: " + err.message))
        }
    }

    async function deleteUsers() {
        try{        
            const csrfToken = getCookie('csrf_token')
            const confirmed = window.confirm("Are you sure? This will delete all user data!")
            if (confirmed){
                const res = await fetch("http://localhost:5000/api/delete-users", {
                    method: "POST", 
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: "include"
                })
                const data = await res.json();
                if (!res.ok){
                    alert(`Error: ${data.message}`);
                    return
                }
                alert(data.message)
            }
        } catch(err){
            alert("Error: " + err.message)
        }
    }

    async function deleteStores() {
        try{        
            const csrfToken = getCookie('csrf_token')
            const confirmed = window.confirm("Are you sure? This will delete all store data!")
            if (confirmed){
                const res = await fetch("http://localhost:5000/api/delete-stores", {
                    method: "POST", 
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: "include"
                })
                const data = await res.json();
                if (!res.ok){
                    alert(`Error: ${data.message}`);
                    return
                }
                alert(data.message)
            }
        } catch(err){
            alert("Error: " + err.message)
        }
    }

    async function deleteReceipts() {
        try{
            const csrfToken = getCookie('csrf_token')
            const confirmed = window.confirm("Are you sure? This will delete all receipt data!")
            if (confirmed){
                const res = await fetch("http://localhost:5000/api/delete-receipts", {
                    method: "POST", 
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: "include"
                })
                const data = await res.json();
                if (!res.ok){
                    alert(`Error: ${data.message}`);
                    return
                }
                alert(data.message)
            }
        } catch(err){
            alert("Error: " + err.message)
        }
    }

    return (
        <div className="p-4">
            <h2>Admin Dashboard</h2>
            <button
                onClick={handleClick}
            >
                Reset Database
            </button>
            <h2>Delete By Category</h2>
            <button
                onClick={deleteUsers}
            >
                Delete Users
            </button>
            <button
                onClick={deleteStores}
            >
                Delete Stores
            </button>
            <button
                onClick={deleteReceipts}
            >
                Delete Receipts
            </button>

        </div>
    );
}
