const Complaint = require('../models/Complaint');

const generateComplaintId = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Find the last complaint for this month
  const lastComplaint = await Complaint.findOne({
    complaintId: new RegExp(`^CMP-${year}${month}-`)
  }).sort({ complaintId: -1 });

  let sequence = 1;
  
  if (lastComplaint) {
    const lastSequence = parseInt(lastComplaint.complaintId.split('-')[2]);
    sequence = lastSequence + 1;
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `CMP-${year}${month}-${sequenceStr}`;
};

module.exports = generateComplaintId;
