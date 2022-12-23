import { Calendar } from '@mantine/next';
import interactionPlugin from '@fullcalendar/interaction';

const calendar:FC = () => {
function( dateClickInfo ) { 
  plugins = [ interactionPlugin ],

  dateClick: function(info) {
    alert('Clicked on: ' + info.dateStr);
    alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    alert('Current view: ' + info.view.type);
    // change the day's background color just for fun
    info.dayEl.style.backgroundColor = 'red';
  }
});
}