import moment from 'moment';

// Format date like "Sunday, Sep 15"
export const formattedDate = (date: string)=>moment(date).format('dddd, MMM D');

// Format time like "4:39 PM"
export const formattedTime = (date: string)=>moment(date).format('h:mm A');

// e.g., "Sunday, Sep 15"
// e.g., "4:39 PM"