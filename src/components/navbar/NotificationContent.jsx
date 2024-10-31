const NotificationContent = ({label, type}) => {
    return (
        <div className="flex justify-between p-2">
            <p>{ label }</p>
            <p className="">Lihat Detail</p>
        </div>
    );
}

export default NotificationContent;