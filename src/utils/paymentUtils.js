export const backupPaymentData = (paymentDetails) => {


  
  const backupData = JSON.stringify(paymentDetails);
  localStorage.setItem('paymentBackup', backupData);
  console.log("Payment data backed up:", backupData);
};