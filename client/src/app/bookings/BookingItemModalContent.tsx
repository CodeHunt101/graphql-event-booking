import { EventProps } from '../events/EventItem'

const BookingItemModalContent = ({
  title,
  description,
  date,
  creator,
}: EventProps) => (
  <>
    <h1>{title}</h1>
    <p>{description}</p>
    <p>
      <b>Date:</b> {new Date(date).toLocaleString()}
    </p>
    <p>
      <b>Creator:</b> {`${creator.email}`}
    </p>
  </>
)

export default BookingItemModalContent
