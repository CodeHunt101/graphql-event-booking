import { RefObject } from 'react'

type CreateEventModalContentProps = {
  titleRef: RefObject<HTMLInputElement>
  priceRef: RefObject<HTMLInputElement>
  dateRef: RefObject<HTMLInputElement>
  descriptionRef: RefObject<HTMLTextAreaElement>
}

const CreateEventModalContent = ({
  titleRef,
  priceRef,
  dateRef,
  descriptionRef,
}: CreateEventModalContentProps) => (
  <>
    <h3 className="font-bold text-lg">Add Event</h3>
    <form className="flex flex-col gap-3">
      <label
        className="input input-bordered flex items-center gap-2"
        htmlFor="title"
      >
        Title:
        <input type="text" className="grow" id="title" ref={titleRef} />
      </label>
      <label
        className="input input-bordered flex items-center gap-2"
        htmlFor="price"
      >
        Price:
        <input type="number" className="grow" id="price" ref={priceRef} />
      </label>
      <label
        className="input input-bordered flex items-center gap-2"
        htmlFor="date"
      >
        Date:
        <input type="datetime-local" className="grow" id="date" ref={dateRef} />
      </label>
      <textarea
        className="textarea textarea-bordered"
        placeholder="Description"
        id="description"
        ref={descriptionRef}
      ></textarea>
    </form>
  </>
)

export default CreateEventModalContent
