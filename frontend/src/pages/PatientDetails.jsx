import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";

import { showOnePatientAPI, editPatientAPI, deletePatientAPI } from "../services/patientService"
import { addNotesAPI, getNotesAPI, editNoteAPI } from "../services/noteService"
import { createAttachmentAPI, getAttachmentAPI, downloadAttachmentAPI } from "../services/attachmentService"

export default function PatientDetails({doctor}) {

    const { patientId } = useParams()
    const navigate = useNavigate()

    const role = localStorage.getItem("role")
    const currentDoctorId = localStorage.getItem("userId")


    const [patient, setPatient] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [editedContent, setEditedContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [note, setNote] = useState([]);
    const patientForm = useForm();
    const noteForm = useForm();
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = patientForm

    const {
        handleSubmit: noteHandleSubmit,
        register: noteRegister,
        reset: noteReset,
        formState: { errors: noteErrors }
    } = noteForm


    useEffect(() => {

        async function fetchPatient() {

            try {

                const res = await showOnePatientAPI(patientId)
                setPatient(res.data.patient)

            }
            catch (err) {
                console.error("Failed to fetch patient:", err);
                toast.error(
                    err.response?.data?.message || "Something went wrong"
                );
            }
            finally{
                setLoading(false)
            }
        }

        fetchPatient()
    }, [patientId])

    //handleEdit

    function handleEdit(){
        setIsEditing(true)
        reset({
            patientInfo: {
                name: patient.patientInfo.name,
                email: patient.patientInfo.email,
                phone: patient.patientInfo.phone,
                age: patient.patientInfo.age,
                gender: patient.patientInfo.gender
},
            medicalRecord: {
                ...patient.medicalRecord,
                doctorAssigned: patient.medicalRecord.doctorAssigned._id,

                admissionDate:
                    patient.medicalRecord.admissionDate
                        ?.split("T")[0]
            }
        })
    }

    async function onSubmit(data){
        try{
            const res = await editPatientAPI(patientId, data)
            setPatient(res.data.patient)
            setIsEditing(false)
            toast.success("Patient details updated successfully");
    
            
        }catch(err){
            console.error("Failed to update the patient:", err);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    
      }
      
       async function handleDelete(patientId) {
       const confirmed = window.confirm(
               "Are you sure you want to delete this patient?"
           )
        
           if(!confirmed) 
           {
            return
        }
                try{
                  await deletePatientAPI(patientId)
                  alert('Patient data has been deleted successfully')
                  toast.success("Patient deleted successfully");
                  navigate('/patients')
                
            }
                catch(err){
                console.error("Failed to delete patient:", err);
                    toast.error(
                        error.response?.data?.message || "Something went wrong"
                    );
        }
           
      }

      async function handleUpload(e){
          e.preventDefault();
            if(!selectedFile){
                toast.error("Please select a file");
                return;
            }
             const formData = new FormData()
             formData.append("attachment", selectedFile)

             try{
                 await createAttachmentAPI(formData, patientId)
                 toast.success("File uploaded successfully")
                 setSelectedFile(null)
                 fetchAttachment()
             }
             catch(err){
                toast.error(err.response?.data?.message || "File upload failed")
             }
      }
      useEffect(()=> {
        fetchAttachment()
      }, [])
      async function fetchAttachment() {
            try{
                const fileAttachment = await getAttachmentAPI(patientId);
                setAttachments(fileAttachment.data.attachments)
            }catch(err){
                console.error("Failed to fetch notes", err);
                toast.error(
                    err.response?.data?.message || "Something went wrong"
                )
            }
      } 

    async function handleDownload(file) {
        try {
            const res = await downloadAttachmentAPI(patientId, file._id);

            const response = await fetch(res.data.downloadUrl);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${file.originalName}`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Download failed"
            );
        }
    }

      async function noteSubmit(content){
        try{
            const newNote = await addNotesAPI(content, patientId)
            fetchNotes()
            noteReset()
        }catch(err){
            console.error("Failed to add notes:", err);
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );    
        }
      }

      useEffect(()=>{
        fetchNotes()
      }, [])

    async function fetchNotes() {
        try {
            const notes = await getNotesAPI(patientId)
            setNote(notes.data)
        }
        catch (err) {
            console.error("Failed to load notes:", err);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        }
    }

      async function handleNoteEdit(note) {
          setEditingNoteId(note._id);
          setEditedContent(note.content);
      }
      
      async function handleNoteSave(noteId) {
        try{

            await editNoteAPI({content:editedContent}, patientId, noteId)
            setEditedContent("")
            setEditingNoteId(null)
            toast.success("Note updated successfully");
            fetchNotes()
        }
        catch(err){
            console.error("Failed to update note:", err);
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );

        }
      }
    const isAssignedDoctor =
        patient?.medicalRecord?.doctorAssigned?._id === currentDoctorId;

    if (loading) {
        return <p>Loading patient details...</p>
    }
    return (
        <>
        {isEditing ?(
            <form onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-8"
            >

                    <h1 className="text-xl font-semibold mb-4">Edit Patient Details</h1>
                   
                    <input
                        id="patientInfo.name"
                        type="text"
                        placeholder="Patient name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("patientInfo.name", {
                            required: "Patient name is required"
                        })}
                    />
                    {errors.patientInfo?.name && (
                        <p className="text-red-500 text-sm">{errors.patientInfo.name.message}</p>
                    )}
                    <input
                        id="patientInfo.email"
                        type="text"
                        placeholder="Patient email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("patientInfo.email", {
                            required: "Patient email is required"
                        })}
                    />
                    {errors.patientInfo?.email && (
                        <p className="text-red-500 text-sm">{errors.patientInfo.email.message}</p>
                    )}
                    <input
                        id="patientInfo.phone"
                        type="text"
                        placeholder="Patient mobile number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("patientInfo.phone", {
                            required: "Patient mobile number is required"
                        })}
                    />
                    {errors.patientInfo?.phone && (
                        <p className="text-red-500 text-sm">{errors.patientInfo.phone.message}</p>
                    )}
                    <input
                        id="patientInfo.age"
                        type="number"
                        placeholder="Patient age"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("patientInfo.age", {
                            required: "Patient age is required",
                            min: {
                                value: 1,
                                message: "Age must be greater than 0"
                            }
                        })}
                    />
                    {errors.patientInfo?.age && (
                        <p className="text-red-500 text-sm">{errors.patientInfo.age.message}</p>
                    )}

                    <select
                        id="patientInfo.gender"
                        type="text"
                        placeholder="Patient gender"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("patientInfo.gender", {
                            required: "Patient gender is required"
                        })}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.patientInfo?.gender && (
                        <p className="text-red-500 text-sm">{errors.patientInfo.gender.message}</p>
                    )}
                    <input
                        id="medicalRecord.disease"
                        type="text"
                        placeholder="Enter disease"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("medicalRecord.disease", {
                            required: "Patient disease is required"
                        })}
                    />
                    {errors.medicalRecord?.disease && (
                        <p className="text-red-500 text-sm">{errors.medicalRecord.disease.message}</p>
                    )}

                    <input
                        id="medicalRecord.treatment"
                        type="text"
                        placeholder="Enter treatment"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("medicalRecord.treatment", {
                            required: "Patient treatment is required"
                        })}
                    />
                    {errors.medicalRecord?.treatment && (
                        <p className="text-red-500 text-sm">{errors.medicalRecord.treatment.message}</p>
                    )}


                    <select
                        {...register("medicalRecord.doctorAssigned")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        {doctor.map((d) => (
                            <option
                                key={d._id}
                                value={d._id}
                            >
                                Dr. {d.name}
                            </option>
                        ))}
                    </select>
                    {errors.medicalRecord?.doctorAssigned && (
                        <p className="text-red-500 text-sm">{errors.medicalRecord.doctorAssigned.message}</p>
                    )}
                    {errors.medicalRecord?.doctorAssigned && (
                        <p className="text-red-500 text-sm">{errors.medicalRecord.doctorAssigned.message}</p>
                    )}

                    <input
                        id="medicalRecord.admissionDate"
                        type="date"
                        placeholder="Enter treatment"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        {...register("medicalRecord.admissionDate", {
                            required: "Patient admission date is required"
                        })}
                    />
                    {errors.medicalRecord?.admissionDate && (
                        <p className="text-red-500 text-sm">{errors.medicalRecord.admissionDate.message}</p>
                    )}
                    <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    type="submit">Save</button>
                    <button type="button" onClick={() => {
                        setIsEditing(false)
                    }}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
                    >Cancel</button>
                
            </form>
        ):(
                    <div className="max-w-5xl mx-auto p-6">
                        <div className="bg-white rounded-xl shadow-md p-6">

                            <h1 className="text-3xl font-bold mb-8">
                                Patient Details
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Personal Information
                                    </h2>

                                    <h3 className="text-lg font-medium mb-3">
                                        {patient?.patientInfo?.name}
                                    </h3>

                                    <p className="mb-2">
                                        <span className="font-semibold">Email:</span>{" "}
                                        {patient?.patientInfo?.email}
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-semibold">Age:</span>{" "}
                                        {patient?.patientInfo?.age}
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-semibold">Gender:</span>{" "}
                                        {patient?.patientInfo?.gender}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Phone:</span>{" "}
                                        {patient?.patientInfo?.phone}
                                    </p>
                                </div>

                                {/* Medical Information */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Medical Information
                                    </h2>

                                    <p className="mb-2">
                                        <span className="font-semibold">Doctor Assigned:</span>{" "}
                                        <Link
                                            to={`/doctor/${patient?.medicalRecord?.doctorAssigned?._id}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {patient?.medicalRecord?.doctorAssigned?.name}
                                        </Link>
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-semibold">Disease:</span>{" "}
                                        {patient?.medicalRecord?.disease}
                                    </p>

                                    <p className="mb-2">
                                        <span className="font-semibold">Treatment:</span>{" "}
                                        {patient?.medicalRecord?.treatment}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Admission Date:</span>{" "}
                                        {patient?.medicalRecord?.admissionDate?.split("T")[0]}
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">

                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Edit
                                </button>

                                {role === "admin" && (
                                    <button
                                        onClick={() => handleDelete(id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>
                            
                            </div>

                        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Attachments
                            </h2>

                            {isAssignedDoctor && (
                                <form
                                    onSubmit={handleUpload}
                                    className="flex flex-col md:flex-row gap-4 items-center mb-6"
                                >
                                    <input
                                        type="file"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2
                   file:mr-4 file:px-4 file:py-2 file:border-0
                   file:bg-blue-100 file:text-blue-700
                   file:rounded-md file:cursor-pointer"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-5 py-2 rounded-lg
                   hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        Upload
                                    </button>
                                </form>
                            )}

                            {attachments.length === 0 ? (
                                <p className="text-gray-500 italic">
                                    No attachments uploaded.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {attachments.map((file) => (
                                        <div
                                            key={file._id}
                                            className="flex justify-between items-center border rounded-lg p-4"
                                        >
                                            <div>
                                                <p className="font-medium">{file.originalName}</p>
                                                <p className="text-sm text-gray-500">
                                                    Uploaded by Dr. {file.uploadedBy.name}
                                                </p>
                                            </div>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(file)}
                                                className="text-green-600 hover:underline cursor-pointer"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
        )}

            <div className="text-l mb-4">
                <div className="bg-white rounded-xl p-6 mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clinical Notes </h2>
                    {
                        isAssignedDoctor && 
                        <form
                            onSubmit={noteHandleSubmit(noteSubmit)}
                            className="mb-6"
                        >
                            <textarea
                                rows="1"
                                placeholder="Add a clinical note..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...noteRegister("content", {
                                    required: "Note content is required"
                                })}
                            />

                            {noteErrors.content && (
                                <p className="text-red-500 text-sm mt-1">
                                    {noteErrors.content.message}
                                </p>
                            )}

                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Add Note
                                </button>
                            </div>


                        </form>
                    }

                    {(note.length === 0) && (
                        <p className="text-center text-gray-500 py-8 italic">
                            No clinical notes available.
                        </p>)
                    }
                       
                        {note.map((n) => (
                            <div
                                key={n._id}
                                className="border-b border-gray-300 py-6 last:border-b-0"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-800">
                                        Dr. {n.author.name}
                                    </h3>

                                    <span className="text-sm text-gray-500">
                                        {new Date(n.createdAt).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            { editingNoteId === n._id ? (
                                
                                    <div className="space-y-3">
                                        <textarea
                                            rows="1"
                                            value={editedContent}
                                            onChange={(e)=> setEditedContent(e.target.value)}
                                            placeholder="Add a clinical note..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          
                                        />


                                        <button type="button"
                                            className="text-sm text-blue-600 hover:text-blue-800 p-1 hover:underline cursor-pointer"
                                            onClick={()=> handleNoteSave(n._id)}>
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingNoteId(null);
                                                setEditedContent("");
                                            }}
                                            className="text-sm text-gray-600 hover:text-gray-800 p-1 hover:underline cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                        
                                ) : (

                                  <>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                       {n.content}
                                    </p>    
                                            {isAssignedDoctor && 
                                            <button
                                                type="button"
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                                onClick={() => handleNoteEdit(n)}>edit
                                            </button>}
                                    </>
                                )}
                              
                                </div>
                            ))}
                </div>
                    </div>

       </>  
    )}
