import { EventProps } from './EventItem'

const EventItemModalContent = ({
  title,
  description,
  price,
  date,
  creator,
}: EventProps) => {
  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        <b>Price:</b> ${`${price}`}
      </p>
      <p>
        <b>Date:</b> {new Date(date).toLocaleString()}
      </p>
      <p>
        <b>Creator:</b> {`${creator.email}`}
      </p>
    </>
  )
}

export default EventItemModalContent
