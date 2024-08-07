import { Component, OnInit, ViewChild } from '@angular/core';
import { LoteriaService } from '../service/loteria.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  paginatedRooms: any[][] = []; // Array de arrays para almacenar las páginas de salas
  players: { [key: number]: any[] } = {}; // Mapa para almacenar jugadores por roomId
  winners: { [key: number]: any[] } = {}; // Mapa para almacenar ganadores por roomId
  playersDataSource = new MatTableDataSource<any>([]);
  winnersDataSource = new MatTableDataSource<any>([]);
  currentPage: number = 0;
  pageSize: number = 5;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedRoomId: number | null = null; // Definir la propiedad aquí

  @ViewChild('playersPaginator', { static: true }) playersPaginator!: MatPaginator;
  @ViewChild('winnersPaginator', { static: true }) winnersPaginator!: MatPaginator;

  constructor(private loteriaService: LoteriaService) {}

  ngOnInit(): void {
    this.loteriaService.getRoomsByOrganizador().subscribe(
      (rooms) => {
        this.rooms = rooms;
        this.filteredRooms = rooms;
        this.paginateRooms();
      },
      (error) => {
        console.error('Error fetching rooms:', error);
      }
    );
  }

  onDateChange(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const createdAt = new Date(room.created_at);
      let isInRange = true;

      if (this.startDate) {
        isInRange = isInRange && createdAt >= new Date(this.startDate);
      }
      if (this.endDate) {
        isInRange = isInRange && createdAt <= new Date(this.endDate);
      }
      return isInRange;
    });
    this.paginateRooms();
  }

  paginateRooms(): void {
    this.paginatedRooms = [];
    for (let i = 0; i < this.filteredRooms.length; i += this.pageSize) {
      this.paginatedRooms.push(this.filteredRooms.slice(i, i + this.pageSize));
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.filteredRooms.length) {
      this.currentPage++;
    }
  }

  onRoomClick(roomId: number): void {
    if (!this.players[roomId]) {
      this.loteriaService.getPlayersByRoom(roomId).subscribe(
        (players) => {
          this.players[roomId] = players;
          this.playersDataSource.data = players;
          this.playersDataSource.paginator = this.playersPaginator;
        },
        (error) => {
          console.error('Error fetching players:', error);
        }
      );
    }

    if (!this.winners[roomId]) {
      this.loteriaService.getWinnersByRoom(roomId).subscribe(
        (winners) => {
          this.winners[roomId] = winners;
          this.winnersDataSource.data = winners;
          this.winnersDataSource.paginator = this.winnersPaginator;
        },
        (error) => {
          console.error('Error fetching winners:', error);
        }
      );
    }

    this.selectedRoomId = roomId; // Establecer el ID de la sala seleccionada
  }
}
