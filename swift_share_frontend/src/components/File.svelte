<script>
  import { slocation } from "slocation";
  import { onMount } from "svelte";
  import downloadjs from "downloadjs";
  import { BASE_URL } from "../config";

  let filepresent = null;
  let file = null;
  let fileid = null;
  let downloadfile = null;
  let senderemail = null;
  let recieveremail = null;



  const get_file = (event) => {
    const files = event.target.files;
    file = files[0];
  };



  onMount(() => {
    fileid = $slocation.pathname?.split("/").reverse()[0];
    if (fileid != "") {
      fetch(`${BASE_URL}/files/${fileid}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((resp) => {
          downloadfile = resp;
        
        });
    }
  });

  const upload = () => {


    const formData = new FormData();
    formData.append("myfile", file);
    fetch(`${BASE_URL}/api/files`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.file) {
          filepresent = resp.file;
          fetch(`${BASE_URL}/api/files/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uuid: resp.uuid,
              emailTo: recieveremail,
              emailFrom: senderemail,
            }),
          })
            .then((res) => res.json())
            .then((response) => {
              alert("the email has been sent with the link to download");
            });
        } else {
          alert("something went wrong,try again !");
        }
      });
  };
  function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  const download = async (uuid, type) => {
    const res = await fetch(`${BASE_URL}/files/download/${uuid}`);
    const blob = await res.blob();
    downloadjs(blob);
    console.log(blob);
  };

  const sendemail = () => {
    console.log(senderemail, recieveremail);
    if (!senderemail || !recieveremail) {
      alert("fill all the details");
    } else {
      upload();
    }
  };
</script>

{#if $slocation.pathname.startsWith("/download_file")}
  <div>
     <div
        class="md:grid  md:gap-6  bg-gray-900 lg:mr-4 lg:mb-4 md:m-0 md:w-full   hover:animate-none h-5/6 items-center justify-center "
      >
        <div class="shadow sm:rounded-md sm:overflow-hidden max-w-full ">
          <div class="px-4 py-5  space-y-6 sm:p-6">
            <div class="">
              <div class="col-span-3 sm:col-span-2">
                <label
                  for="company-website"
                  class="block text-sm font-bold text-white"
                >
                  Download the file Now
                </label>
              </div>
            </div>
            <div>
              <div>
                <div
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div class="space-y-1 text-center">
                      <div class="flex text-sm text-gray-600">
                        <span class="text-white"></span>
                        <a
                          on:click={() => {
                            file = null;
                          }}
                          href="#"
                        >
                        </a>
                        <p class="text-xs text-white">
                          File Size {bytesToSize(downloadfile?.fileSize)}
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3  text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md text-black text-sm bg-gray-300  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                on:click={() => download(downloadfile?.uuid)}
              >
                Download
              </button>
            </div>
          </div>
          <a href="https://github.com/raghavyuva/Swift-Share.git" class="text-blue-200 hover:text-red-400">like this project on github?</a>
        </div>
      </div>
  </div>
{:else}
  <div>
    {#if filepresent == null}
      <div
        class="md:grid  md:gap-6  bg-gray-900 lg:mr-4 lg:mb-4 md:m-0 md:w-full   hover:animate-none h-5/6 items-center justify-center "
      >
        <div class="shadow sm:rounded-md sm:overflow-hidden max-w-full ">
          <div class="px-4 py-5  space-y-6 sm:p-6">
            <div class="">
              <div class="col-span-3 sm:col-span-2">
                <label
                  for="company-website"
                  class="block text-sm font-bold text-white"
                >
                  Send this file to
                </label>
                <div class="mt-1 flex rounded-md shadow-sm ">
                  <input
                    type="text"
                    name="company-website"
                    id="company-website"
                    class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 bg-gray-700 text-white h-8 p-2"
                    placeholder="toemail@example.com"
                    on:change={(e) => {
                      recieveremail = e.target.value;
                    }}
                  />
                </div>
                <label
                  for="company-website"
                  class="block text-sm font-bold text-white"
                >
                  Tell your email
                </label>
                <div class="mt-1 flex rounded-md shadow-sm ">
                  <input
                    type="text"
                    name="company-website"
                    id="company-website"
                    class=" flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 bg-gray-700 text-white h-8 p-2"
                    placeholder="youremail@example.com"
                    on:change={(e) => {
                      senderemail = e.target.value;
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <div
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div class="space-y-1 text-center">
                    {#if !file}
                      <div class="flex text-sm text-gray-600">
                        <label
                          for="file-upload"
                          class="relative cursor-pointer bg-gray-600 rounded-md font-medium text-white hover:text-yellow-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            class="sr-only"
                            on:change={get_file}
                          />
                        </label>
                        <p class="pl-1 text-white">
                          or ask your friend to share
                        </p>
                      </div>
                      <p class="text-xs text-white">File Size upto 1GB</p>
                     
                    {:else}
                      <span class="text-white">{file.name}</span>
                      <a
                        on:click={() => {
                          file = null;
                        }}
                        href="#"
                      >
                        <p class="pl-1 text-red-300">cancel</p>
                      </a>
                      <p class="text-xs text-white">
                        File Size {bytesToSize(file.size)}
                      </p>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3  text-right sm:px-6">
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md text-black text-sm bg-gray-300  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                on:click={sendemail}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div>
        <div
        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-red-400"
      >
        <div class="space-y-1 text-center">
           <h2 class="text-blue-900 font-serif font-semibold">Share below link with your friend</h2>
           <p class="text-xs text-red font-extrabold ">link will expire after 24hrs</p>
           <p class="text-blue-900 font-serif font-semibold flex-wrap">{filepresent}</p>
        </div>
      </div>
      </div>
    {/if}
  </div>
{/if}
