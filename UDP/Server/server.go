package main

import (
	"fmt"
	"net"
	"os"
	"time"
)

func main() {
	service := "127.0.0.1:34500"
	udpAddr, err := net.ResolveUDPAddr("udp4", service)
	checkError(err)
	conn, err := net.ListenUDP("udp", udpAddr)
	fmt.Printf("Local: <%s> \n", conn.LocalAddr().String())
	for {
		handleClient(conn)
	}
}

func handleClient(conn *net.UDPConn) {
	var buf [512]byte
	_, addr, err := conn.ReadFromUDP(buf[0:])
	fmt.Printf("Recieved a message says : \"%s\" from <%s> \n", string(buf[0:]), addr.String())
	if err != nil {
		return
	}
	daytime := time.Now().Format("2006-01-02 15:04:05")
	msg := "I have recieved your message.  " + daytime
	conn.WriteToUDP([]byte(msg), addr)
}

func checkError(err error) {
	if err != nil {
		fmt.Fprintf(os.Stderr, "Fatal error ", err.Error())
		os.Exit(1)
	}
}
