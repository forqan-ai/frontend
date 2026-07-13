import { Component } from "@angular/core";
import { CoursesBrowseComponent } from "./pages/courses-browse/courses-browse.component";
import { Routes } from "@angular/router";



export const coursesBrowseRoutes: Routes = [{
  path: '', component: CoursesBrowseComponent, title: 'الدورات'
}]
