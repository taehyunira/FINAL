// Test the schedule generation logic
const BEST_POSTING_SCHEDULE = [
  { day: 'friday', time: '18:00' },
  { day: 'wednesday', time: '12:00' },
  { day: 'tuesday', time: '10:00' },
  { day: 'thursday', time: '15:00' },
  { day: 'saturday', time: '11:00' },
  { day: 'monday', time: '09:00' },
  { day: 'sunday', time: '19:00' }
];

function generateWeeklySchedule(startDate, numberOfPosts) {
  const slots = [];
  const daysMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const selectedSchedule = BEST_POSTING_SCHEDULE.slice(0, numberOfPosts);
  const startDateObj = new Date(startDate);

  console.log('Start date:', startDateObj.toDateString(), '- Day of week:', startDateObj.getDay());

  for (const schedule of selectedSchedule) {
    const targetDayOfWeek = daysMap[schedule.day];
    const currentDay = startDateObj.getDay();
    let daysUntilTarget = targetDayOfWeek - currentDay;

    if (daysUntilTarget < 0) {
      daysUntilTarget += 7;
    }

    const postDate = new Date(startDateObj);
    postDate.setDate(startDateObj.getDate() + daysUntilTarget);

    console.log(`${schedule.day} -> ${postDate.toDateString()} (${postDate.getDay()}) at ${schedule.time}`);

    slots.push({
      date: postDate,
      day: schedule.day,
      time: schedule.time
    });
  }

  return slots;
}

// Test with 3 posts starting from a Monday
const result = generateWeeklySchedule('2025-11-10', 3);
console.log('\n--- Final schedule ---');
result.forEach((slot, i) => {
  console.log(`Post ${i+1}: ${slot.day} - ${slot.date.toDateString()} at ${slot.time}`);
});
