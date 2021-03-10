<template>
    <b-container class="vh-100 d-flex flex-column" fluid>
      <b-navbar>
        <b-collapse is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/login">Login</b-nav-item>
            <b-nav-item to="/register">Register</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-row class="flex-grow-1 overflow-auto" align-v="center" align-h="center">
        <b-col cols="auto">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
</template>