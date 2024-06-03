import MaterialTable from '@material-table/core'
import { Avatar } from '@mui/material'
import { AdminLayout } from 'layouts'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { User } from 'types'
import { MuiTblOptions } from 'utils'

export default function Students() {
  const [data, setData] = useState([])
  const [refetch, setRefetch] = useState(false)
  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/student/getAll')
      const result = await res.json()
      console.log(
        result.data.map((_: any) => ({
          ..._,
          ..._.metadata,
        }))
      )
      setData(
        result.data.map((_: any) => ({
          ..._,
          ..._.metadata,
        }))
      )
    })()
  }, [refetch])

  const sendNotificationToSelectedUsers = async (users: User[]) => {
    const { value: title } = await Swal.fire({
      title: "What's the title of the notification?",
      input: 'text',
      inputLabel: 'Title',
      inputPlaceholder: "e.g. 'You have been blocked from using the app'",
      confirmButtonText: 'Next',
    })
    if (!title)
      return Swal.fire(
        'Cancelled',
        "You didn't enter a title for the notification",
        'error'
      )
    const { value: message } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: "e.g. 'You have been blocked from using the app'",
      showCancelButton: true,
      confirmButtonText: 'Send Notification',
    })
    if (!message)
      return Swal.fire(
        'Cancelled',
        "You didn't enter a message for the notification",
        'error'
      )
    Swal.fire(
      'Please Wait',
      "We're sending the notification to the selected users",
      'info'
    )
    for (const selectedUser of users) {
    }
    Swal.fire('Success', 'successfully Notifications Sent', 'success')
  }
  return (
    <AdminLayout title="Students - Admin Panel">
      <div className="px-4 py-4">
        <MaterialTable
          isLoading={data === null}
          title={'Students'}
          options={{ ...MuiTblOptions(), selection: true, filtering: true }}
          columns={[
            {
              title: '#',
              field: 'sl',
              editable: 'never',
              width: '5%',
              filtering: false,
            },
            {
              title: 'Name',
              field: 'name',
              hideFilterIcon: true,
              render: ({ name }) => (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar
                      sx={{
                        bgcolor: `#${Math.random().toString().slice(2, 8)}`,
                      }}
                      className={`shadow`}
                    >
                      {name?.[0]}
                    </Avatar>
                    <div className="">
                      <h4 className="">{name}</h4>
                    </div>
                  </div>
                </>
              ),
            },
            {
              title: 'Roll Number',
              field: 'roll-number',
              export: true,
            },
            {
              title: 'Gender',
              field: 'gender.key',
              lookup: {
                male: 'Male',
                female: 'Female',
              },
            },
            {
              title: 'DOB',
              field: 'dob',
              type: 'date',
              emptyValue: '-',
              editable: 'never',
            },
            {
              title: 'Created At',
              field: 'created_at',

              render: ({ created_at }) =>
                moment(new Date(created_at)).format('LLL'),
              editable: 'never',
              type: 'date',
            },
            {
              title: 'Updated At',
              field: 'modified_at',
              render: ({ modified_at }) =>
                moment(new Date(modified_at)).fromNow(),
              editable: 'never',
              type: 'date',
            },
          ]}
          data={
            data === null ? [] : data?.map((_: any, i) => ({ ..._, sl: i + 1 }))
          }
          actions={[
            {
              icon: 'notifications',
              tooltip: 'Send Notification To Selected Users',
              onClick: async (event, rowData) => {
                const selectedUsers = rowData as User[]
                sendNotificationToSelectedUsers(selectedUsers)
              },
            },
          ]}
          editable={{
            onRowAdd: async (newData) => {
              try {
                console.log(newData)
                const apiResponse = await fetch('/api/student/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },

                  body: JSON.stringify({
                    name: newData.name,

                    ['roll-number']: +newData?.['roll-number'],
                    gender: {
                      male: 'Male',
                      female: 'Female',
                    }[newData.gender.key as 'male' | 'female'],
                  }),
                })
                const result = await apiResponse.json()
                console.log(result)
                if (result?.error)
                  return Swal.fire('Error', result?.message, 'error')
                Swal.fire('Success', 'Successfully added', 'success')
              } catch (error: any) {
                Swal.fire(
                  'Error',
                  error?.message || 'Error creating user',
                  'error'
                )
              } finally {
                setRefetch((prev) => !prev)
              }
            },
            onRowDelete: async (oldData) => {
              try {
                const apiResponse = await fetch('/api/student/delete', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: oldData.id,
                  }),
                })
                const result = await apiResponse.json()
                console.log(result)
                if (result?.error)
                  return Swal.fire('Error', result?.message, 'error')
                Swal.fire('Success', 'Successfully deleted', 'success')
              } catch (error: any) {
                Swal.fire(
                  'Error',
                  error?.message || 'Error creating user',
                  'error'
                )
              } finally {
                setRefetch((prev) => !prev)
              }
            },
          }}
        />
      </div>
    </AdminLayout>
  )
}
