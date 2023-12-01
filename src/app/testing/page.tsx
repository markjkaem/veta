import React from 'react'


const deleteItem = async () => {
await fetch("http://localhost:3000/api/avatar/delete", {
    method: "POST",
    body: JSON.stringify({id: 1})
})
}
async function Page() {
    await deleteItem()
  return (
    <div></div>
  )
}

export default Page