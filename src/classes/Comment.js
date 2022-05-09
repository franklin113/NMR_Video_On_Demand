class Comment {
  constructor({ attendeeId, email, libraryId, firstName, lastName, text, timestamp, videoId }) {
    if (
      !(attendeeId && email && libraryId && firstName && lastName && text && timestamp && videoId)
    ) {
      throw new Error('validation error while creating comment')
    }
    this.attendeeId = attendeeId
    this.email = email
    this.libraryId = libraryId
    this.firstName = firstName
    this.lastName = lastName
    this.text = text
    this.timestamp = timestamp
    this.videoId = videoId
  }
  getData() {
    return {
      attendeeId: this.attendeeId,
      email: this.email,
      libraryId: this.libraryId,
      firstName: this.firstName,
      lastName: this.lastName,
      text: this.text,
      timestamp: this.timestamp,
      videoId: this.videoId,
    }
  }
}
export default Comment
