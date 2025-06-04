import { ToastrModule } from 'ngx-toastr';
import 'ngx-toastr/toastr.css'; // Import CSS for toast notifications

@NgModule({
  declarations: [
    // ...existing components...
  ],
  imports: [
    // ...existing modules...
    ToastrModule.forRoot(), // Add ToastrModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}