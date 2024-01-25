import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import DropdownSearch from "components/dropdown/DropdownSearch";
import TextareaField from "components/fields/TextField";
import { Editor } from '@tinymce/tinymce-react';

const ContentManageEdit = () => {
    // get the id from the url which is in form of /job/edit?id=1

    const navigate = useNavigate();
    const [fetchedData, setFetchedData] = useState({});
    const [updateData, setUpdateData] = useState(null);
    const [dataType, setDataType] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [title, setTitle] = useState("");

    let dataRef = useRef("");

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        loadRecord()
    }, []);

    const loadRecord = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getContentById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                _id: id
            })
        })
            .then(resp => resp.json())
            .then((res) => {
                let data = res
                setIsLoading(false)
                setFetchedData(data)
                setDataType(data.slug)
                setTitle(data.title)
                if (res.slug === "faq") {
                    setUpdateData(data.content)
                } else {
                    setUpdateData(data.content[0])
                }
            })
    }

    const cancelEdit = () => {
        navigate("/contentManage");
    }

    const editRecord = async () => {
        setIsLoading(true);
        let payload = {
            ...fetchedData,
            title,
            updatedAt: new Date().toJSON()
        }

        if (dataType === "faq") {
            payload["content"] = updateData
        } else {
            payload["content"] = [dataRef.current.getContent()]
        }
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(resp => resp.json())
            .then((res) => {
                setIsLoading(false);
                cancelEdit()
            })
    }

    const addFaq = () => {
        setUpdateData([...updateData, {
            question: "",
            answer: ""
        }])
    }

    const updateFaq = (value, index, type) => {
        let data = [...updateData]
        if (type == "question") {
            data[index].question = value
        } else {
            data[index].answer = value
        }
        setUpdateData(data)
    }

    const deleteFaq = (index) => {
        let data = []
        updateData.map((ele, i) => {
            if (i != index) {
                data.push(ele)
            }
        })
        setUpdateData(data)
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Update Data
                    </p>
                    <InputField
                        variant="auth"
                        extra="mb-6 w-80 mr-5"
                        label="Title"
                        placeholder="Title"
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {
                        dataType === "faq" ?
                            <div className="w-full">
                                <div className="flex flex-col mb-5 w-full">
                                    {updateData && updateData.map((ele, index) => {
                                        return (
                                            <div className="flex flex-row items-end w-full">
                                                <div className="w-full">
                                                    <InputField
                                                        variant="auth"
                                                        extra="mb-3 w-full mr-5"
                                                        label="Question"
                                                        placeholder="Question"
                                                        id="range"
                                                        type="text"
                                                        value={ele.question}
                                                        onChange={(e) => updateFaq(e.target.value, index, "question")}
                                                    />
                                                    <TextareaField
                                                        variant="auth"
                                                        extra="mb-3 w-full mr-5"
                                                        label="Answer"
                                                        placeholder="Answer"
                                                        id="range"
                                                        type="text"
                                                        value={ele.answer}
                                                        onChange={(e) => updateFaq(e.target.value, index, "answer")}
                                                    />
                                                </div>
                                                <button className="btn btn-error w-20 ml-4" onClick={() => deleteFaq(index)}>Delete</button>
                                            </div>
                                        )
                                    })
                                    }
                                    <button className="btn btn-primary w-20" onClick={addFaq}>Add</button>
                                </div>
                            </div>
                            :
                            <>
                                <label className="text-gray-800 text-sm">Page content</label>
                                <Editor
                                    onInit={(evt, editor) => dataRef.current = editor}
                                    initialValue={updateData}
                                    init={{
                                        branding: false,
                                        height: 500,
                                        plugins: 'image',
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | link image | ' +
                                            'removeformat | help',
                                        image_title: true,
                                        automatic_uploads: true,
                                        file_picker_types: 'image',
                                        menubar: false,
                                        file_picker_callback: function (cb, value, meta) {
                                            var input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*');

                                            input.onchange = function () {
                                                var file = this.files[0];

                                                var reader = new FileReader();
                                                reader.onload = function () {
                                                    var dataUrl = reader.result;
                                                    cb(dataUrl, { title: file.name });
                                                };
                                                reader.readAsDataURL(file);
                                            };

                                            input.click();
                                        },
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    apiKey="6wcrclc3rpcyda01awzmjycdz6l34o43hu5c6br9ov3weyvo"
                                />
                            </>
                    }

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button
                                onClick={editRecord}
                                className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`}
                                disabled={isLoading}
                            >
                                {!isLoading ? 'Submit' : 'Loading...'}
                            </button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/report">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ContentManageEdit;